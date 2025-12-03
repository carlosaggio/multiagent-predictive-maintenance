// Cerebra Demo uses its own layout without the main navbar
export default function CerebraDemoLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {children}
    </div>
  );
}


