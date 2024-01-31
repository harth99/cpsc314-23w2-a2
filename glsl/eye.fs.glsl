in vec3 modelPos;

void main() {
	// TODO: Add some conditions to color the pupil
	// The eye is facing +z so that when it is initially positioned on the armadillo,
	// it should be facing backward.
	// The following color is Eye whites (the Armadillo is tired, so the eye whites are pinkish).
	gl_FragColor = vec4(1.0, 0.9, 0.9, 1.0);
}
