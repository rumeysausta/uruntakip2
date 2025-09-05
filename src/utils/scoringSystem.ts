import { DealerPerformance, ScoringCriteria, ScoringWeights, StarRating } from '../types';

// Calculate individual scores based on criteria
export const calculateOrderApprovalScore = (dealer: DealerPerformance, criteria: ScoringCriteria): number => {
  // Mock calculation - in real app, this would use actual order approval data
  const avgApprovalTime = 2.5; // This would come from actual data
  
  if (avgApprovalTime <= 1) return criteria.orderApproval.day1;
  if (avgApprovalTime <= 2) return criteria.orderApproval.day2;
  if (avgApprovalTime <= 3) return criteria.orderApproval.day3;
  if (avgApprovalTime <= 4) return criteria.orderApproval.day4;
  return criteria.orderApproval.day5Plus;
};

export const calculateDeliveryScore = (dealer: DealerPerformance, criteria: ScoringCriteria): number => {
  const deliveryTime = dealer.averageDeliveryTime;
  
  if (deliveryTime <= 2) return criteria.delivery.day1to2;
  if (deliveryTime <= 4) return criteria.delivery.day3to4;
  if (deliveryTime <= 7) return criteria.delivery.day5to7;
  if (deliveryTime <= 10) return criteria.delivery.day8to10;
  return criteria.delivery.day10Plus;
};

export const calculateSatisfactionScore = (dealer: DealerPerformance, criteria: ScoringCriteria): number => {
  const satisfaction = dealer.customerSatisfaction;
  
  if (satisfaction >= 4.5) return criteria.satisfaction.star5;
  if (satisfaction >= 3.5) return criteria.satisfaction.star4;
  if (satisfaction >= 2.5) return criteria.satisfaction.star3;
  if (satisfaction >= 1.5) return criteria.satisfaction.star2;
  return criteria.satisfaction.star1;
};

export const calculateCompletionScore = (dealer: DealerPerformance, criteria: ScoringCriteria): number => {
  const completionRate = (dealer.completedOrders / dealer.totalOrders) * 100;
  
  if (completionRate >= 95) return criteria.completion.percent95to100;
  if (completionRate >= 90) return criteria.completion.percent90to94;
  if (completionRate >= 85) return criteria.completion.percent85to89;
  if (completionRate >= 80) return criteria.completion.percent80to84;
  return criteria.completion.percentUnder80;
};

// Calculate overall performance score
export const calculatePerformanceScore = (
  dealer: DealerPerformance, 
  criteria: ScoringCriteria, 
  weights: ScoringWeights
): { totalScore: number; breakdown: any } => {
  const orderApprovalScore = calculateOrderApprovalScore(dealer, criteria);
  const deliveryScore = calculateDeliveryScore(dealer, criteria);
  const satisfactionScore = calculateSatisfactionScore(dealer, criteria);
  const completionScore = calculateCompletionScore(dealer, criteria);

  const totalScore = Math.round(
    (orderApprovalScore * weights.orderApproval / 100) +
    (deliveryScore * weights.delivery / 100) +
    (satisfactionScore * weights.satisfaction / 100) +
    (completionScore * weights.completion / 100)
  );

  return {
    totalScore,
    breakdown: {
      orderApprovalScore,
      deliveryScore,
      satisfactionScore,
      completionScore
    }
  };
};

// Calculate star rating based on score
export const calculateStarRating = (score: number, starSystem: StarRating[]): number => {
  for (const rating of starSystem) {
    if (score >= rating.minScore && score <= rating.maxScore) {
      return rating.stars;
    }
  }
  return 1; // Default to 1 star
};

// Get star rating label
export const getStarRatingLabel = (score: number, starSystem: StarRating[]): string => {
  for (const rating of starSystem) {
    if (score >= rating.minScore && score <= rating.maxScore) {
      return rating.label;
    }
  }
  return 'Kritik';
};

// Build dealer hierarchy
export const buildDealerHierarchy = (dealers: DealerPerformance[]): DealerPerformance[] => {
  const mainDealers = dealers.filter(d => d.type === 'main-dealer');
  const subDealers = dealers.filter(d => d.type === 'dealer');

  // Assign sub-dealers to main dealers
  mainDealers.forEach(mainDealer => {
    mainDealer.subDealers = subDealers.filter(sub => sub.parentDealerId === mainDealer.id);
  });

  return mainDealers;
};

// Calculate main dealer score based on sub-dealers
export const calculateMainDealerScore = (mainDealer: DealerPerformance): number => {
  if (!mainDealer.subDealers || mainDealer.subDealers.length === 0) {
    return mainDealer.performanceScore || 0;
  }

  const totalScore = mainDealer.subDealers.reduce((sum, sub) => sum + (sub.performanceScore || 0), 0);
  return Math.round(totalScore / mainDealer.subDealers.length);
};

// Filter dealers by star rating
export const filterDealersByStars = (dealers: DealerPerformance[], starRating: number): DealerPerformance[] => {
  return dealers.filter(dealer => dealer.starRating === starRating);
};

// Sort dealers by various criteria
export const sortDealers = (
  dealers: DealerPerformance[], 
  sortBy: 'score' | 'revenue' | 'orders' | 'satisfaction'
): DealerPerformance[] => {
  const sorted = [...dealers];
  
  switch (sortBy) {
    case 'score':
      return sorted.sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
    case 'revenue':
      return sorted.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
    case 'orders':
      return sorted.sort((a, b) => b.totalOrders - a.totalOrders);
    case 'satisfaction':
      return sorted.sort((a, b) => b.customerSatisfaction - a.customerSatisfaction);
    default:
      return sorted;
  }
};
