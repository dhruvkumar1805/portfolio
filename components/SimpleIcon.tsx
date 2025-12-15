export type SimpleIconProps = {
  icon: any;
  size?: number;
};

export function SimpleIcon({ icon, size = 16 }: SimpleIconProps) {
  return (
    <span
    className="simple-icon"
      style={{
        width: size,
        height: size,
        display: "inline-block",
      }}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
}
