import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = v_texCoord;
    
    // Create soft, drifting electric glows on true black
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 electricBlue = vec3(0.05, 0.1, 0.3);
    vec3 violet = vec3(0.2, 0.0, 0.3);

    float orb1 = smoothstep(0.8, 0.0, length(uv - vec2(0.2 + 0.1 * sin(u_time * 0.5), 0.3 + 0.1 * cos(u_time * 0.7))));
    float orb2 = smoothstep(0.9, 0.0, length(uv - vec2(0.8 + 0.1 * cos(u_time * 0.4), 0.7 + 0.1 * sin(u_time * 0.6))));
    float orb3 = smoothstep(0.6, 0.0, length(uv - vec2(0.5 + 0.2 * sin(u_time * 0.3), 0.5 + 0.2 * cos(u_time * 0.3))));

    vec3 finalColor = mix(black, electricBlue, orb1 * 0.3 + orb2 * 0.3);
    finalColor = mix(finalColor, violet, orb3 * 0.2);

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(type: number, src: string) {
      const s = gl.createShader(type);
      if(!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    if(!prog) return;
    
    const vsShader = createShader(gl.VERTEX_SHADER, vs);
    const fsShader = createShader(gl.FRAGMENT_SHADER, fs);
    if(vsShader && fsShader) {
      gl.attachShader(prog, vsShader);
      gl.attachShader(prog, fsShader);
      gl.linkProgram(prog);
      gl.useProgram(prog);
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    
    function render(t: number) {
      if (!gl || gl.isContextLost()) return;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas!.width, canvas!.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameId = requestAnimationFrame(render);
    }
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      const ext = gl?.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
