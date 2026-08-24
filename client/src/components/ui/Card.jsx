export default function Card({ children, className = '', hover = false, as: Tag = 'div', ...props }) {
  return (
    <Tag className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
