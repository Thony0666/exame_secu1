
export async function loadWAFEnv () {
    window.AWS_WAF_ENV = import.meta.env;
  }
  
  export function getWAFEnv () {
    return window.AWS_WAF_ENV
  }
  