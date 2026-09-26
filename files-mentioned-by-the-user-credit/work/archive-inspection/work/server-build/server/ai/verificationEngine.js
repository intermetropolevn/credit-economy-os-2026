const SYSTEM_INSTRUCTION = [
    'You are an AI Economic Operator for a demonstration application.',
    'Observe contracts and deliverables, then propose a structured recommendation.',
    'Do not mutate ledger state or claim authority over rules, eligibility, risk, or clearing.',
    'Return JSON only. The server will independently validate every amount and enum.',
].join(' ');
function numberWithin(value, minimum, maximum, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}
function baseAssessment(totalValue) {
    const releaseAmount = Math.round(totalValue * 0.7);
    const holdAmount = totalValue - releaseAmount;
    return {
        finding: 'Partial fulfillment detected: two required motion assets are missing.',
        fulfillmentScore: 70,
        riskLevel: 'medium',
        recommendation: 'release',
        releaseAmount,
        holdAmount,
        confidence: 87,
        rationale: `Verified milestones support releasing ${releaseAmount} credits. The remaining ${holdAmount} credits stay reserved until missing deliverables are verified or an authorized dispute process resolves them.`,
        evidence: [
            'Brand identity deliverables verified against Clause 2.1.',
            'Three of five dynamic social assets verified against Clause 4.2.',
            'Two required vertical motion formats are absent.',
            'Source files remain reserved pending Clause 4.2 resolution.',
        ],
        isValidated: true,
        validationDetails: { totalConserved: true, balanceConstraintPassed: true, boundsChecked: true },
        milestonesEvaluation: [
            { name: 'Brand Identity Synthesis', status: 'VERIFIED', allocated: Math.round(totalValue * 0.3), recommended: Math.round(totalValue * 0.3) },
            { name: 'Social Marketing Dynamic Assets', status: 'PARTIAL', allocated: Math.round(totalValue * 0.4), recommended: Math.round(totalValue * 0.4) },
            { name: 'Master Source Files', status: 'HELD', allocated: Math.round(totalValue * 0.3), recommended: 0 },
        ],
    };
}
function scenarioAssessment(totalValue, scenario) {
    const fallback = baseAssessment(totalValue);
    if (scenario === 'full') {
        return {
            ...fallback,
            finding: 'Complete contractual fulfillment verified across all tranches.',
            fulfillmentScore: 100,
            riskLevel: 'low',
            recommendation: 'release',
            releaseAmount: totalValue,
            holdAmount: 0,
            confidence: 96,
            rationale: 'All supplied contractual milestones and deliverable records are present in this demo scenario.',
            evidence: ['Brand identity package verified.', 'All dynamic social formats verified.', 'Master source archive verified.'],
        };
    }
    if (scenario === 'disputed') {
        const releaseAmount = Math.round(totalValue * 0.3);
        return {
            ...fallback,
            finding: 'Significant non-conformance detected; an authorized dispute review is required.',
            fulfillmentScore: 30,
            riskLevel: 'high',
            recommendation: 'hold',
            releaseAmount,
            holdAmount: totalValue - releaseAmount,
            confidence: 91,
            rationale: 'The verified portion is limited while the remaining value is held pending authorized resolution.',
            evidence: ['Brand identity deliverable verified.', 'Dynamic asset integrity check failed.', 'Master source files are unavailable.'],
        };
    }
    return fallback;
}
function parseModelResponse(content) {
    try {
        const parsed = JSON.parse(content);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    }
    catch {
        return null;
    }
}
/** The authoritative validation boundary for every AI proposal. */
function validateProposal(proposal, fallback, totalValue, engine) {
    const rawRelease = numberWithin(proposal?.releaseAmount, 0, totalValue, fallback.releaseAmount);
    const releaseAmount = Math.round(rawRelease * 100) / 100;
    const holdAmount = Math.round((totalValue - releaseAmount) * 100) / 100;
    const risk = String(proposal?.riskLevel || fallback.riskLevel).toLowerCase();
    const recommendation = String(proposal?.recommendation || fallback.recommendation).toLowerCase();
    return {
        ...fallback,
        finding: typeof proposal?.finding === 'string' ? proposal.finding : fallback.finding,
        fulfillmentScore: Math.round(numberWithin(proposal?.fulfillmentScore, 0, 100, fallback.fulfillmentScore) * 10) / 10,
        riskLevel: (['low', 'medium', 'high'].includes(risk) ? risk : fallback.riskLevel),
        recommendation: (['release', 'hold', 'refund', 'escalate'].includes(recommendation) ? recommendation : fallback.recommendation),
        releaseAmount,
        holdAmount,
        confidence: Math.round(numberWithin(proposal?.confidence, 0, 100, fallback.confidence)),
        rationale: typeof proposal?.rationale === 'string' ? proposal.rationale : fallback.rationale,
        evidence: Array.isArray(proposal?.evidence) && proposal.evidence.every((item) => typeof item === 'string') && proposal.evidence.length > 0
            ? proposal.evidence
            : fallback.evidence,
        isValidated: true,
        validationDetails: {
            totalConserved: releaseAmount + holdAmount === totalValue,
            balanceConstraintPassed: releaseAmount >= 0 && holdAmount >= 0,
            boundsChecked: releaseAmount <= totalValue && holdAmount <= totalValue,
        },
        timestamp: new Date().toISOString(),
        engine,
    };
}
export async function verifyEconomicState(request, provider) {
    const totalValue = numberWithin(request.transaction?.totalValue, 0, Number.MAX_SAFE_INTEGER, 1000);
    const fallback = scenarioAssessment(totalValue, request.scenario);
    try {
        const response = await provider.generate({
            task: 'economic-verification',
            systemInstruction: SYSTEM_INSTRUCTION,
            input: {
                transaction: request.transaction || {},
                contract: request.contract || [],
                deliverables: request.deliverables || [],
                economicState: request.economicState || {},
            },
            demoResponse: fallback,
        });
        return validateProposal(parseModelResponse(response.content), fallback, totalValue, `${provider.displayName} · ${response.model}`);
    }
    catch {
        return validateProposal(null, fallback, totalValue, 'Deterministic AI Demo Runtime · policy fallback');
    }
}
