const risk_opportunity_option = [
    { value : 0, label : 'Select' },
    { value : 1, label : 'Risk'},
    { value : 2, label : 'Opportunity'}
]

const severity_option = [
    { value : 0, label : 'Select' },
    { value : 1, label : 'Negligible'},
    { value : 2, label : 'Minor'},
    { value : 3, label : 'Moderate'},
    { value : 4, label : 'Major'},
    { value : 5, label : 'Catastrophic'},
]

const likelihood_option = [
    { value : 0, label : 'Select' },
    { value : 1, label : 'Rare'},
    { value : 2, label : 'Remote'},
    { value : 3, label : 'Occasional'},
    { value : 4, label : 'Frequent'},
    { value : 5, label : 'Almost Certain'},
]

export default {
    risk_opportunity_option,
    severity_option,
    likelihood_option
}