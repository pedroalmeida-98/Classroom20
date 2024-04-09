
AFRAME.registerComponent('color-picker', {
    schema: {
        color: {
            type: 'color',
            default: 'black'
        }
    },
   init: function() {
    var box = document.getElementById("colorSelected");
    var colorWheel = document.getElementById("color-wheel");
    var black = document.getElementById("black");
    var text = document.getElementById("textColor");
    this.intersectionVisual = document.querySelector("[intersection-visual]");
    this.texturePainter = document.querySelector("[texture-painter]");
  

    //Esconder inicialmente
    box.setAttribute("visible", false);
    colorWheel.setAttribute("visible", false);
    black.setAttribute("visible", false);
    text.setAttribute("visible", false);
    box.classList.remove("hittable");
    colorWheel.classList.remove("hittable");
    black.classList.remove("hittable");
   

    //Escutar o botão'x' ser pressionado
    var leftController = document.getElementById("left");
    leftController.addEventListener("buttondown", function(event) {
      //console.log(event.detail.id);
      if (event.detail.id === 4) { //equivalente ao botao x do emulador
        var boxVisible = box.getAttribute("visible");
        var visibility = !boxVisible
        box.setAttribute("visible", visibility);
        colorWheel.setAttribute("visible", visibility);
        black.setAttribute("visible", visibility);
        text.setAttribute("visible", visibility);
        
        var visibility = !boxVisible
        if (visibility) {
                    box.classList.add("hittable");
                    colorWheel.classList.add("hittable");
                    black.classList.add("hittable");
                } else {
                    box.classList.remove("hittable");
                    colorWheel.classList.remove("hittable");
                    black.classList.remove("hittable");
                }
      }
    });
      
      var vertexShader = '\
      varying vec2 vUv;\
      void main() {\
        vUv = uv;\
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
        gl_Position = projectionMatrix * mvPosition;\
      }\
      ';

      var fragmentShader = '\
      #define M_PI2 6.28318530718\n \
      uniform float brightness;\
      varying vec2 vUv;\
      vec3 hsb2rgb(in vec3 c){\
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, \
                           0.0, \
                           1.0 );\
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\
          return c.z * mix( vec3(1.0), rgb, c.y);\
      }\
      \
      void main() {\
        vec2 toCenter = vec2(0.5) - vUv;\
        float angle = atan(toCenter.y, toCenter.x);\
        float radius = length(toCenter) * 2.0;\
        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\
        gl_FragColor = vec4(color, 1.0);\
      }\
      ';

      var material = new THREE.ShaderMaterial({
        uniforms: {
          brightness: {
            type: 'f',
            value: 0.9
          }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });
      //console.log(this.el.object3D)
      this.mesh = this.el.getObject3D('mesh');

      this.mesh.material = material;

      this.el.addEventListener("click", (e) => {
        if(!e.detail.intersection.uv){console.log("ai preto")}
        let point = e.detail.intersection.uv
        point.x = point.x * 2 - 1
        point.y = point.y * 2 - 1
        var theta = Math.PI + Math.atan2(point.y, point.x)
        var h, s, l
        h = (theta / (2 * Math.PI) + 0.5) % 1;
        s = Math.sqrt(point.x * point.x + point.y * point.y);
        l = 0.6
        var color = this.hslToHex(h, s, 1 - s * 0.6)
        box.setAttribute("material", "color", color)
        this.el.setAttribute('material', "color",color)
        if (this.intersectionVisual) {
            this.intersectionVisual.setAttribute('intersection-visual', "color",color);
        }
        if (this.texturePainter) {
            this.texturePainter.setAttribute('texture-painter', "color",color);
            this.texturePainter.setAttribute('texture-painter', {
                clearing: 'false'
            });                    
        }
      })
    },
    hslToHex: function(h, s, l) {
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  });