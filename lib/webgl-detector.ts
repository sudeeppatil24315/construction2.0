/**
 * Detects WebGL support in the browser
 * @returns true if WebGL is supported, false otherwise
 */
export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl') ||
      canvas.getContext('webgl2');

    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Gets WebGL capabilities and performance tier
 */
export function getWebGLCapabilities() {
  if (!detectWebGLSupport()) {
    return {
      supported: false,
      tier: 'none' as const,
      maxTextureSize: 0,
      maxVertexAttributes: 0,
    };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

    if (!gl) {
      return {
        supported: false,
        tier: 'none' as const,
        maxTextureSize: 0,
        maxVertexAttributes: 0,
      };
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

    // Determine performance tier based on capabilities
    let tier: 'low' | 'medium' | 'high' = 'low';
    if (maxTextureSize >= 8192 && maxVertexAttributes >= 16) {
      tier = 'high';
    } else if (maxTextureSize >= 4096 && maxVertexAttributes >= 8) {
      tier = 'medium';
    }

    return {
      supported: true,
      tier,
      maxTextureSize,
      maxVertexAttributes,
    };
  } catch (e) {
    return {
      supported: false,
      tier: 'none' as const,
      maxTextureSize: 0,
      maxVertexAttributes: 0,
    };
  }
}
