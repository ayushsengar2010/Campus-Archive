// Duplicate Detection Utilities
import { similarity } from 'ml-distance';

/**
 * Calculate similarity between two strings using Jaccard similarity
 */
const calculateJaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Calculate semantic similarity using keyword overlap and common phrases
 */
const calculateSemanticSimilarity = (text1, text2) => {
  // Normalize texts
  const normalize = (text) => text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  // Extract keywords (words longer than 3 characters)
  const getKeywords = (text) => text.split(' ')
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'].includes(word));
  
  const keywords1 = getKeywords(norm1);
  const keywords2 = getKeywords(norm2);
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  // Calculate keyword overlap
  const commonKeywords = keywords1.filter(word => keywords2.includes(word));
  const keywordSimilarity = (2 * commonKeywords.length) / (keywords1.length + keywords2.length);
  
  // Calculate phrase similarity (3-word phrases)
  const getPhrases = (words) => {
    const phrases = [];
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push(words.slice(i, i + 3).join(' '));
    }
    return phrases;
  };
  
  const phrases1 = getPhrases(norm1.split(' '));
  const phrases2 = getPhrases(norm2.split(' '));
  
  const commonPhrases = phrases1.filter(phrase => phrases2.includes(phrase));
  const phraseSimilarity = phrases1.length > 0 && phrases2.length > 0 
    ? (2 * commonPhrases.length) / (phrases1.length + phrases2.length)
    : 0;
  
  // Weighted combination
  return (keywordSimilarity * 0.7) + (phraseSimilarity * 0.3);
};

/**
 * Check for potential duplicates in a submission
 */
export const checkForDuplicates = (newSubmission, existingSubmissions, thresholds = {}) => {
  const {
    titleThreshold = 0.8,
    descriptionThreshold = 0.6,
    combinedThreshold = 0.7
  } = thresholds;

  const duplicates = [];
  
  existingSubmissions.forEach(existing => {
    // Skip if same submission
    if (existing.id === newSubmission.id) return;
    
    // Calculate title similarity
    const titleSimilarity = calculateJaccardSimilarity(
      newSubmission.title || '',
      existing.title || ''
    );
    
    // Calculate description similarity
    const descriptionSimilarity = calculateSemanticSimilarity(
      newSubmission.description || '',
      existing.description || ''
    );
    
    // Combined similarity score
    const combinedSimilarity = (titleSimilarity * 0.6) + (descriptionSimilarity * 0.4);
    
    // Determine duplicate level
    let duplicateLevel = 'none';
    let reasons = [];
    
    if (titleSimilarity >= titleThreshold) {
      duplicateLevel = 'high';
      reasons.push(`Title similarity: ${(titleSimilarity * 100).toFixed(1)}%`);
    }
    
    if (descriptionSimilarity >= descriptionThreshold) {
      if (duplicateLevel !== 'high') duplicateLevel = 'medium';
      reasons.push(`Description similarity: ${(descriptionSimilarity * 100).toFixed(1)}%`);
    }
    
    if (combinedSimilarity >= combinedThreshold && duplicateLevel === 'none') {
      duplicateLevel = 'low';
      reasons.push(`Overall similarity: ${(combinedSimilarity * 100).toFixed(1)}%`);
    }
    
    // Additional checks
    if (newSubmission.githubUrl && existing.githubUrl && 
        newSubmission.githubUrl === existing.githubUrl) {
      duplicateLevel = 'high';
      reasons.push('Identical GitHub URL');
    }
    
    if (duplicateLevel !== 'none') {
      duplicates.push({
        submission: existing,
        level: duplicateLevel,
        titleSimilarity,
        descriptionSimilarity,
        combinedSimilarity,
        reasons,
        confidence: Math.max(titleSimilarity, descriptionSimilarity, combinedSimilarity)
      });
    }
  });
  
  // Sort by confidence level
  duplicates.sort((a, b) => b.confidence - a.confidence);
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    highRiskCount: duplicates.filter(d => d.level === 'high').length,
    mediumRiskCount: duplicates.filter(d => d.level === 'medium').length,
    lowRiskCount: duplicates.filter(d => d.level === 'low').length
  };
};

/**
 * Generate duplicate warning message
 */
export const generateDuplicateWarning = (duplicateResult) => {
  if (!duplicateResult.hasDuplicates) return null;
  
  const { highRiskCount, mediumRiskCount, lowRiskCount } = duplicateResult;
  
  if (highRiskCount > 0) {
    return {
      level: 'error',
      title: 'Potential Duplicate Detected',
      message: `This submission appears very similar to ${highRiskCount} existing submission${highRiskCount > 1 ? 's' : ''}. Please review before submitting.`,
      action: 'review'
    };
  }
  
  if (mediumRiskCount > 0) {
    return {
      level: 'warning',
      title: 'Similar Content Found',
      message: `This submission has similarities with ${mediumRiskCount} existing submission${mediumRiskCount > 1 ? 's' : ''}. Consider reviewing for uniqueness.`,
      action: 'review'
    };
  }
  
  if (lowRiskCount > 0) {
    return {
      level: 'info',
      title: 'Similar Submissions Exist',
      message: `Found ${lowRiskCount} submission${lowRiskCount > 1 ? 's' : ''} with some similarities. This may be normal for related work.`,
      action: 'acknowledge'
    };
  }
  
  return null;
};

/**
 * Hook for duplicate detection in forms
 */
export const useDuplicateDetection = (submissions) => {
  const checkDuplicates = (formData) => {
    return checkForDuplicates(formData, submissions);
  };
  
  return { checkDuplicates };
};