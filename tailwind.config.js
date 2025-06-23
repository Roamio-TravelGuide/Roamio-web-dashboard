// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-30px) translateX(20px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(-20px)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-15px) translateX(15px)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'float-medium': 'float-medium 8s ease-in-out infinite',
        'float-fast': 'float-fast 6s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backdropBlur: {
        xs: '1px',
        lg: '16px',
        xl: '24px',
      }
    }
  }
}