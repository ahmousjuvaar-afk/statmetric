/**
 * Research Test Selector Decision Matrix & Taxonomy.
 * Guides users from research design questions to verified parametric and non-parametric tests.
 */

export interface TestRecommendation {
  id: string;
  name: string;
  category: 'Parametric' | 'Non-Parametric' | 'Categorical' | 'Regression';
  calculatorPath?: string;
  description: string;
  whenToUse: string;
  keyAssumptions: string[];
  alternativeTest: string;
  alternativeReason: string;
  apaExample: string;
}

export interface SelectorDecision {
  goal: 'compare_means' | 'relationship' | 'proportions' | 'prediction';
  variableType: 'continuous' | 'categorical' | 'mixed';
  groups: 'one' | 'two_independent' | 'two_paired' | 'three_plus';
  distribution: 'normal' | 'non_normal' | 'unknown';
}

export const STATISTICAL_TESTS: Record<string, TestRecommendation> = {
  'two_sample_ttest': {
    id: 'two_sample_ttest',
    name: 'Independent Two-Sample T-Test (Student / Welch)',
    category: 'Parametric',
    calculatorPath: '/calculators/t-test',
    description: 'Compares the means of two independent, unrelated groups on a continuous dependent variable.',
    whenToUse: 'When testing whether treatment and control groups differ significantly in average scores.',
    keyAssumptions: ['Continuous outcome variable', 'Independent observations', 'Approximate normality within groups', 'Equal variance (or use Welch correction)'],
    alternativeTest: 'Mann-Whitney U Test (Wilcoxon Rank-Sum)',
    alternativeReason: 'Use Mann-Whitney U if your sample size is small and the distribution is strongly skewed or ordinal.',
    apaExample: 't(38) = 2.45, p = .019, d = 0.77',
  },
  'paired_ttest': {
    id: 'paired_ttest',
    name: 'Paired Samples T-Test (Dependent)',
    category: 'Parametric',
    calculatorPath: '/calculators/t-test',
    description: 'Compares means from the same participants at two time points (e.g. pre-test vs. post-test) or matched pairs.',
    whenToUse: 'When measuring change within the same subjects over time or across two repeated conditions.',
    keyAssumptions: ['Continuous dependent variable', 'Paired/repeated observations', 'Differences between pairs are approximately normal'],
    alternativeTest: 'Wilcoxon Signed-Rank Test',
    alternativeReason: 'Use Wilcoxon Signed-Rank if the difference scores are non-normally distributed or ordinal.',
    apaExample: 't(24) = 3.12, p = .005, d = 0.62',
  },
  'one_way_anova': {
    id: 'one_way_anova',
    name: 'One-Way Analysis of Variance (ANOVA)',
    category: 'Parametric',
    calculatorPath: '/calculators/anova',
    description: 'Tests whether there are statistically significant differences among the means of three or more independent groups.',
    whenToUse: 'When comparing 3 or more treatment conditions (e.g., placebo, low dose, high dose).',
    keyAssumptions: ['Continuous outcome', 'Independent groups', 'Normal distribution in each group', 'Homogeneity of variance'],
    alternativeTest: 'Kruskal-Wallis Test',
    alternativeReason: 'Use Kruskal-Wallis if group distributions violate normality or variances are vastly unequal.',
    apaExample: 'F(2, 42) = 4.88, p = .012, η² = .189',
  },
  'pearson_correlation': {
    id: 'pearson_correlation',
    name: 'Pearson Correlation & Simple Linear Regression',
    category: 'Parametric',
    calculatorPath: '/calculators/correlation-regression',
    description: 'Measures the strength, direction, and linear association between two continuous variables.',
    whenToUse: 'When assessing if higher values on variable X are associated with higher (or lower) values on variable Y.',
    keyAssumptions: ['Both variables continuous (interval/ratio)', 'Linear relationship (check scatterplot)', 'Bivariate normal distribution', 'Homoscedasticity'],
    alternativeTest: 'Spearman Rank Correlation (rho)',
    alternativeReason: 'Use Spearman if the relationship is monotonic but non-linear, or if data contains severe outliers.',
    apaExample: 'r(48) = .54, p < .001, R² = .29',
  },
  'chi_square_independence': {
    id: 'chi_square_independence',
    name: 'Chi-Square Test of Independence (Contingency Table)',
    category: 'Categorical',
    calculatorPath: '/calculators/chi-square',
    description: 'Evaluates whether an association exists between two categorical variables.',
    whenToUse: 'When cross-tabulating frequency data (e.g. smoking status [yes/no] vs. disease [present/absent]).',
    keyAssumptions: ['Both variables are categorical', 'Mutually exclusive categories', 'Expected cell frequencies ≥ 5 in at least 80% of cells'],
    alternativeTest: "Fisher's Exact Test",
    alternativeReason: "Use Fisher's Exact Test if you have a 2x2 table with small expected cell counts (under 5).",
    apaExample: 'χ²(1, N = 120) = 6.42, p = .011, V = .23',
  },
  'mann_whitney': {
    id: 'mann_whitney',
    name: 'Mann-Whitney U Test (Wilcoxon Rank-Sum)',
    category: 'Non-Parametric',
    calculatorPath: '/calculators/p-value',
    description: 'Non-parametric alternative to the independent two-sample t-test comparing rank sums of two groups.',
    whenToUse: 'When comparing two independent groups on ordinal data or non-normally distributed continuous data.',
    keyAssumptions: ['Random samples', 'Independent observations', 'Ordinal or continuous scale'],
    alternativeTest: 'Welch Two-Sample T-Test',
    alternativeReason: 'If sample sizes are large (N > 30 per group), the central limit theorem often allows parametric t-tests.',
    apaExample: 'U = 142.0, p = .028',
  },
};

export function getRecommendedTest(decision: SelectorDecision): {
  recommended: TestRecommendation;
  alternatives: TestRecommendation[];
  guidanceText: string;
} {
  const { goal, variableType, groups, distribution } = decision;

  // 1. Proportions / Categorical
  if (goal === 'proportions' || variableType === 'categorical') {
    return {
      recommended: STATISTICAL_TESTS['chi_square_independence'],
      alternatives: [],
      guidanceText:
        'Because both variables are categorical counts/frequencies, a Chi-Square test of independence (or Fisher’s exact test for small tables) evaluates whether group memberships are dependent.',
    };
  }

  // 2. Correlation / Relationship
  if (goal === 'relationship' || goal === 'prediction') {
    return {
      recommended: STATISTICAL_TESTS['pearson_correlation'],
      alternatives: [],
      guidanceText:
        'For two continuous variables where you wish to quantify association and fit a predictive line, Pearson correlation and Ordinary Least Squares (OLS) regression provide the correlation coefficient r and slope equation.',
    };
  }

  // 3. Comparing means / groups
  if (groups === 'three_plus') {
    return {
      recommended: STATISTICAL_TESTS['one_way_anova'],
      alternatives: [STATISTICAL_TESTS['two_sample_ttest']],
      guidanceText:
        'When comparing 3 or more independent groups, do not perform multiple pairwise t-tests (which inflates family-wise Type I error rate). Use One-Way ANOVA first to test the omnibus null hypothesis.',
    };
  }

  if (groups === 'two_paired') {
    return {
      recommended: STATISTICAL_TESTS['paired_ttest'],
      alternatives: [STATISTICAL_TESTS['mann_whitney']],
      guidanceText:
        'Because the same subjects are measured twice or pairs are matched, a paired-samples t-test isolates the within-subject differences, providing greater statistical power.',
    };
  }

  // Default: Two independent groups
  if (distribution === 'non_normal') {
    return {
      recommended: STATISTICAL_TESTS['mann_whitney'],
      alternatives: [STATISTICAL_TESTS['two_sample_ttest']],
      guidanceText:
        'Because your data violates the normality assumption and cannot be transformed, the non-parametric Mann-Whitney U test evaluates differences in medians / rank distributions without parametric assumptions.',
    };
  }

  return {
    recommended: STATISTICAL_TESTS['two_sample_ttest'],
    alternatives: [STATISTICAL_TESTS['mann_whitney']],
    guidanceText:
      'For comparing two independent groups on a continuous metric, Student’s or Welch’s two-sample t-test is the standard inferential test. Welch’s t-test is robust to unequal variances.',
  };
}
