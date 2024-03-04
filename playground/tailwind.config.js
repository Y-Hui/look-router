const genVar = (max = 100, suffix = 'px') => {
  const result = {
    1: `1${suffix}`,
  }
  let i = 0
  while (i < max) {
    const val = i + 2
    i += 2
    result[val] = `${val}${suffix}`
  }
  return result
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: genVar(),
    extend: {
      borderRadius: {
        none: 0,
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        5: '5px',
        6: '6px',
        7: '7px',
        8: '8px',
        9: '9px',
        10: '10px',
      },
      spacing: genVar(),
      padding: genVar(),
      margin: genVar(),
    },
  },
}
