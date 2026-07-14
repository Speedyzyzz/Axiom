import { useEffect, useRef } from 'react';

export default function ShaderCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    let animationFrameId;

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
    
    // Create soft, drifting glow orbs
    vec3 color1 = vec3(0.043, 0.059, 0.078); // #0B0F14 (Deep Navy)
    vec3 color2 = vec3(0.106, 0.165, 0.29);  // #1B2A4A (Navy Glow)
    vec3 gold = vec3(0.788, 0.635, 0.153);   // #C9A227 (Gold)

    float orb1 = smoothstep(0.8, 0.0, length(uv - vec2(0.2 + 0.1 * sin(u_time * 0.5), 0.3 + 0.1 * cos(u_time * 0.7))));
    float orb2 = smoothstep(0.9, 0.0, length(uv - vec2(0.8 + 0.1 * cos(u_time * 0.4), 0.7 + 0.1 * sin(u_time * 0.6))));
    float goldOrb = smoothstep(0.4, 0.0, length(uv - vec2(0.5 + 0.2 * sin(u_time * 0.3), 0.5 + 0.2 * cos(u_time * 0.3))));

    vec3 finalColor = mix(color1, color2, orb1 * 0.4 + orb2 * 0.4);
    finalColor = mix(finalColor, gold, goldOrb * 0.05);

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    function render(t) {
      if (gl.isContextLost()) return;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameId = requestAnimationFrame(render);
    }
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      
      // Prevent memory leaks
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full opacity-60 z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
