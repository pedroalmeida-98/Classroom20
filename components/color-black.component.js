AFRAME.registerComponent('color-black', {
    schema: {
        color: {
            type: 'color',
            default: 'black'
        }
    },
    init: function() {
        var self = this; // Capture the reference to 'this'

        // Find intersection-visual and texture-painter elements
        this.intersectionVisual = document.querySelector("[intersection-visual]");
        this.texturePainter = document.querySelector("[texture-painter]");
        var box = document.getElementById("colorSelected");
        
        // Event listener for click
        this.el.addEventListener("click", function() {
            // Set color to black
            box.setAttribute("material", "color", "black");
            self.el.setAttribute('material', "color", "black");

            // Update intersection-visual if available
            if (self.intersectionVisual) {
                self.intersectionVisual.setAttribute('intersection-visual', "color", "black");
            }

            // Update texture-painter if available
            if (self.texturePainter) {
                self.texturePainter.setAttribute('texture-painter', "color", "black");
                self.texturePainter.setAttribute('texture-painter', {
                    clearing: 'false'
                });                    
            }
        });
    }
});
