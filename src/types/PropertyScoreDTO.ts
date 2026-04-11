export interface PropertyScoreDTO {
    propertyId?: number;
    recommendationScore?: number;
    priceReasonablenessScore: number;
    rentalPerformanceScore: number;
    sellerMotivationScore: number;
    propertyConditionScore: number;
    transactionComplexityScore: number;
    notes?: string;
}
