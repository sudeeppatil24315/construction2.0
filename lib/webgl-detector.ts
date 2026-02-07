/**
 * Detects WebGL support in the browser
 * @returns true if WebGL is supported, false otherwise
 */

// Cache the WebGL support result to avoid creating multiple contexts
let webGLSupportCache: boolean | null = null;

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Return cached result if available
  if (webGLSupportCache !== null) {
    return webGLSupportCache;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });

    const supported = !!(gl && (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext));
    
    // Clean up the test canvas immediately
    if (gl && (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext)) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
    }
    
    // Cache the result
    webGLSupportCache = supported;
    return supported;
  } catch (e) {
    webGLSupportCache = false;
    return false;
  }
}

/**
 * Gets WebGL capabilities and performance tier
 */

interface WebGLCapabilities {
  supported: boolean;
  tier: 'none' | 'low' | 'medium' | 'high';
  maxTextureSize: number;
  maxVertexAttributes: number;
}

// Cache the WebGL capabilities result
let webGLCapabilitiesCache: WebGLCapabilities | null = null;

export function getWebGLCapabilities(): WebGLCapabilities {
  // Return cached result if available
  if (webGLCapabilitiesCache !== null) {
    return webGLCapabilitiesCache;
  }

  if (!detectWebGLSupport()) {
    const result: WebGLCapabilities = {
      supported: false,
      tier: 'none',
      maxTextureSize: 0,
      maxVertexAttributes: 0,
    };
    webGLCapabilitiesCache = result;
    return result;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) || 
               canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });

    if (!gl || !(gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext)) {
      const result: WebGLCapabilities = {
        supported: false,
        tier: 'none',
        maxTextureSize: 0,
        maxVertexAttributes: 0,
      };
      webGLCapabilitiesCache = result;
      return result;
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

    // Clean up the test canvas
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    const result: WebGLCapabilities = {
      supported: true,
      tier,
      maxTextureSize,
      maxVertexAttributes,
    };
    
    webGLCapabilitiesCache = result;
    return result;
  } catch (e) {
    const result: WebGLCapabilities = {
      supported: false,
      tier: 'none',
      maxTextureSize: 0,
      maxVertexAttributes: 0,
    };
    webGLCapabilitiesCache = result;
    return result;
  }
}
