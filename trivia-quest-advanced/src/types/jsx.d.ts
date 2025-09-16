declare module '*.jsx' {
    const component: React.FC<Record<string, unknown>>;
    export default component;
}
