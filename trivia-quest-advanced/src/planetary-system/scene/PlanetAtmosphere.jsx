const PlanetAtmosphere = () => {
    return (
        <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="lightblue" transparent opacity={0.2} />
        </mesh>
    );
};

export default PlanetAtmosphere;
