/** Can this page show other sites in an iframe? Not when it is itself embedded (e.g. a preview viewer). */
export const canEmbed = () => typeof window !== 'undefined' && window.self === window.top
