const replaceTokens = (input, tokens) => {
    const regex = /\{{(.+?)\}}/gm
    const input_ = typeof input === 'string' ? input : JSON.stringify(input)
    const output = input_.replace(regex, (_m, $1) => tokens[$1])
    if (typeof input === 'string') return output
    return JSON.parse(output)
}

module.exports = { replaceTokens }