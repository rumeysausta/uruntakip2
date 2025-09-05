import { FurnitureOrder, FurnitureProduct, FurnitureProductStage, ProductionRisk, FURNITURE_PRODUCTION_STAGES, QUALITY_CRITERIA } from '../types/furnitureTypes';

export class FurnitureTrackingEngine {
  // Her ürün kalemi için ayrı takip algoritması
  static calculateProductProgress(product: FurnitureProduct): {
    overallProgress: number;
    stageProgress: { [stageId: string]: number };
    estimatedCompletion: string;
    risks: ProductionRisk[];
    bottlenecks: string[];
  } {
    const stages = product.productionStages;
    let completedStages = 0;
    let totalWeight = 0;
    let completedWeight = 0;
    const stageProgress: { [stageId: string]: number } = {};
    const risks: ProductionRisk[] = [];
    const bottlenecks: string[] = [];

    // Her aşama için ağırlık hesapla
    stages.forEach((stage, index) => {
      const weight = this.getStageWeight(stage.department, stage.name);
      totalWeight += weight;

      let progress = 0;
      if (stage.status === 'completed') {
        progress = 100;
        completedWeight += weight;
        completedStages++;
      } else if (stage.status === 'in-progress') {
        progress = this.calculateInProgressStageProgress(stage);
        completedWeight += (weight * progress) / 100;
      } else if (stage.status === 'delayed') {
        progress = this.calculateDelayedStageProgress(stage);
        completedWeight += (weight * progress) / 100;
        
        // Gecikme riski ekle
        risks.push({
          id: `risk-${stage.id}`,
          type: 'material-delay',
          severity: 'high',
          probability: 0.8,
          impact: this.calculateDelayImpact(stage),
          description: `${stage.name} aşaması gecikme yaşıyor`,
          mitigation: 'Alternatif tedarikçi araştırılması',
          assignedTo: stage.responsibleParty,
          status: 'monitoring'
        });
      }

      stageProgress[stage.id] = progress;

      // Bottleneck tespiti
      if (stage.status === 'in-progress' && this.isBottleneck(stage, stages, index)) {
        bottlenecks.push(stage.name);
      }
    });

    const overallProgress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    const estimatedCompletion = this.calculateEstimatedCompletion(product, overallProgress);

    return {
      overallProgress: Math.round(overallProgress),
      stageProgress,
      estimatedCompletion,
      risks,
      bottlenecks
    };
  }

  // Aşama ağırlığı hesaplama
  private static getStageWeight(department: string, stageName: string): number {
    const weights = {
      'design': 5,
      'production': 40,
      'quality': 15,
      'assembly': 25,
      'logistics': 15
    };
    return weights[department as keyof typeof weights] || 10;
  }

  // Devam eden aşama ilerlemesi
  private static calculateInProgressStageProgress(stage: FurnitureProductStage): number {
    if (!stage.startDate) return 0;
    
    const startTime = new Date(stage.startDate).getTime();
    const currentTime = Date.now();
    const elapsedHours = (currentTime - startTime) / (1000 * 60 * 60);
    
    const progress = Math.min(95, (elapsedHours / stage.estimatedDuration) * 100);
    return Math.max(0, progress);
  }

  // Gecikmiş aşama ilerlemesi
  private static calculateDelayedStageProgress(stage: FurnitureProductStage): number {
    const baseProgress = this.calculateInProgressStageProgress(stage);
    return Math.min(baseProgress, 80); // Gecikmiş aşamalar max %80
  }

  // Gecikme etkisi hesaplama
  private static calculateDelayImpact(stage: FurnitureProductStage): number {
    const plannedDuration = stage.estimatedDuration;
    const actualDuration = stage.actualDuration || 0;
    return Math.max(0, Math.ceil((actualDuration - plannedDuration) / 24)); // gün cinsinden
  }

  // Bottleneck tespiti
  private static isBottleneck(stage: FurnitureProductStage, allStages: FurnitureProductStage[], currentIndex: number): boolean {
    // Eğer bu aşama gecikiyorsa ve sonraki aşamalar bekliyor durumda ise bottleneck
    if (stage.status !== 'in-progress') return false;
    
    const nextStages = allStages.slice(currentIndex + 1, currentIndex + 3);
    const waitingStages = nextStages.filter(s => s.status === 'pending').length;
    
    return waitingStages >= 2;
  }

  // Tahmini tamamlanma tarihi
  private static calculateEstimatedCompletion(product: FurnitureProduct, currentProgress: number): string {
    const remainingStages = product.productionStages.filter(s => s.status !== 'completed');
    let totalRemainingHours = 0;

    remainingStages.forEach(stage => {
      if (stage.status === 'in-progress') {
        const progress = this.calculateInProgressStageProgress(stage);
        totalRemainingHours += stage.estimatedDuration * (1 - progress / 100);
      } else {
        totalRemainingHours += stage.estimatedDuration;
      }
    });

    // Risk faktörü ekle (%20 buffer)
    totalRemainingHours *= 1.2;

    const completionDate = new Date();
    completionDate.setHours(completionDate.getHours() + totalRemainingHours);
    
    return completionDate.toISOString().split('T')[0];
  }

  // Sipariş seviyesinde toplu takip
  static calculateOrderProgress(order: FurnitureOrder): {
    overallProgress: number;
    productProgress: { [productId: string]: any };
    criticalPath: string[];
    estimatedDelivery: string;
    totalRisks: ProductionRisk[];
    recommendations: string[];
  } {
    let totalWeight = 0;
    let completedWeight = 0;
    const productProgress: { [productId: string]: any } = {};
    const allRisks: ProductionRisk[] = [];
    const criticalPath: string[] = [];
    const recommendations: string[] = [];

    // Her ürün için ilerleme hesapla
    order.products.forEach(product => {
      const weight = product.quantity;
      totalWeight += weight;

      const progress = this.calculateProductProgress(product);
      productProgress[product.id] = progress;
      
      completedWeight += (weight * progress.overallProgress) / 100;
      allRisks.push(...progress.risks);

      // Kritik yol tespiti
      if (progress.bottlenecks.length > 0) {
        criticalPath.push(`${product.name}: ${progress.bottlenecks.join(', ')}`);
      }

      // Öneriler
      if (progress.overallProgress < 50 && progress.risks.length > 0) {
        recommendations.push(`${product.name} için acil müdahale gerekli`);
      }
    });

    const overallProgress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    const estimatedDelivery = this.calculateOrderDeliveryDate(order, productProgress);

    // Genel öneriler
    if (allRisks.length > 3) {
      recommendations.push('Çok sayıda risk tespit edildi, proje yöneticisi ile görüşün');
    }
    if (criticalPath.length > 0) {
      recommendations.push('Kritik yol üzerindeki darboğazları öncelikle çözün');
    }

    return {
      overallProgress: Math.round(overallProgress),
      productProgress,
      criticalPath,
      estimatedDelivery,
      totalRisks: allRisks,
      recommendations
    };
  }

  // Sipariş teslimat tarihi hesaplama
  private static calculateOrderDeliveryDate(order: FurnitureOrder, productProgress: { [productId: string]: any }): string {
    let latestCompletion = new Date();

    Object.values(productProgress).forEach((progress: any) => {
      const completionDate = new Date(progress.estimatedCompletion);
      if (completionDate > latestCompletion) {
        latestCompletion = completionDate;
      }
    });

    // Paketleme ve sevkiyat süresi ekle (2-3 gün)
    latestCompletion.setDate(latestCompletion.getDate() + 3);

    return latestCompletion.toISOString().split('T')[0];
  }

  // Kalite skoru hesaplama
  static calculateQualityScore(product: FurnitureProduct): {
    overallScore: number;
    categoryScores: { [category: string]: number };
    issues: string[];
    recommendations: string[];
  } {
    const categoryScores: { [category: string]: number } = {};
    const issues: string[] = [];
    const recommendations: string[] = [];
    let totalWeight = 0;
    let weightedScore = 0;

    // Kalite kontrol sonuçlarını analiz et
    Object.entries(QUALITY_CRITERIA).forEach(([category, criteria]) => {
      const relevantChecks = product.qualityChecks.filter(check => 
        criteria.checks.some(c => check.stage.toLowerCase().includes(c.toLowerCase()))
      );

      if (relevantChecks.length > 0) {
        const avgScore = relevantChecks.reduce((sum, check) => sum + check.score, 0) / relevantChecks.length;
        categoryScores[category] = avgScore;
        
        totalWeight += criteria.weight;
        weightedScore += avgScore * criteria.weight;

        // Düşük skorlar için uyarı
        if (avgScore < 7) {
          issues.push(`${criteria.name} kategorisinde düşük skor: ${avgScore.toFixed(1)}`);
          recommendations.push(`${criteria.name} için ek kontrol yapılmalı`);
        }
      }
    });

    const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      categoryScores,
      issues,
      recommendations
    };
  }

  // Üretim kapasitesi analizi
  static analyzeProductionCapacity(orders: FurnitureOrder[]): {
    departmentLoad: { [department: string]: number };
    bottleneckDepartments: string[];
    capacityRecommendations: string[];
    weeklySchedule: { [week: string]: { [department: string]: number } };
  } {
    const departmentLoad: { [department: string]: number } = {
      design: 0,
      production: 0,
      quality: 0,
      assembly: 0,
      logistics: 0
    };

    const weeklySchedule: { [week: string]: { [department: string]: number } } = {};

    // Aktif siparişlerdeki tüm aşamaları analiz et
    orders.forEach(order => {
      if (['in-production', 'quality-check'].includes(order.status)) {
        order.products.forEach(product => {
          product.productionStages.forEach(stage => {
            if (['in-progress', 'pending'].includes(stage.status)) {
              departmentLoad[stage.department] += stage.estimatedDuration;
              
              // Haftalık planlama
              const week = this.getWeekKey(new Date());
              if (!weeklySchedule[week]) {
                weeklySchedule[week] = { ...departmentLoad };
              }
              weeklySchedule[week][stage.department] += stage.estimatedDuration;
            }
          });
        });
      }
    });

    // Darboğaz departmanları tespit et (>80% kapasite)
    const maxCapacity = 160; // haftalık 40 saat * 4 kişi
    const bottleneckDepartments = Object.entries(departmentLoad)
      .filter(([_, load]) => load > maxCapacity * 0.8)
      .map(([dept, _]) => dept);

    const capacityRecommendations: string[] = [];
    if (bottleneckDepartments.length > 0) {
      capacityRecommendations.push(`Şu departmanlarda kapasite artırımı gerekli: ${bottleneckDepartments.join(', ')}`);
    }

    return {
      departmentLoad,
      bottleneckDepartments,
      capacityRecommendations,
      weeklySchedule
    };
  }

  private static getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil((date.getDate() - date.getDay() + 1) / 7);
    return `${year}-W${week}`;
  }

  // Müşteri bilgilendirme sistemi
  static generateCustomerUpdate(order: FurnitureOrder): {
    message: string;
    estimatedDelivery: string;
    nextMilestone: string;
    delayReason?: string;
    compensationOffer?: string;
  } {
    const progress = this.calculateOrderProgress(order);
    
    let message = `Merhaba ${order.customerName}, `;
    let delayReason: string | undefined;
    let compensationOffer: string | undefined;

    if (progress.overallProgress >= 90) {
      message += `siparişiniz tamamlanmak üzere! Teslimat hazırlıkları başladı.`;
    } else if (progress.overallProgress >= 70) {
      message += `siparişiniz son aşamalarında. Kalite kontrolleri devam ediyor.`;
    } else if (progress.overallProgress >= 40) {
      message += `siparişiniz üretim aşamasında. Her şey planlandığı gibi ilerliyor.`;
    } else {
      message += `siparişiniz üretim sürecinde. Malzeme hazırlıkları tamamlandı.`;
    }

    // Gecikme durumu kontrolü
    const originalDelivery = new Date(order.requestedDeliveryDate || order.orderDate);
    const newDelivery = new Date(progress.estimatedDelivery);
    
    if (newDelivery > originalDelivery) {
      const delayDays = Math.ceil((newDelivery.getTime() - originalDelivery.getTime()) / (1000 * 60 * 60 * 24));
      delayReason = progress.totalRisks.length > 0 ? progress.totalRisks[0].description : 'Üretim yoğunluğu';
      
      if (delayDays > 7) {
        compensationOffer = 'Gecikmeden dolayı ücretsiz montaj hizmeti sunuyoruz.';
      }
    }

    return {
      message,
      estimatedDelivery: progress.estimatedDelivery,
      nextMilestone: this.getNextMilestone(order),
      delayReason,
      compensationOffer
    };
  }

  private static getNextMilestone(order: FurnitureOrder): string {
    const allStages = order.products.flatMap(p => p.productionStages);
    const nextStage = allStages.find(s => s.status === 'in-progress') || 
                     allStages.find(s => s.status === 'pending');
    
    return nextStage ? nextStage.name : 'Teslimat hazırlığı';
  }
}
