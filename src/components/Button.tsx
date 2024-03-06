interface ButtonProps {
    onClick: () => void;
    style?: string; 
    name: string; 
}

const Button = ({ onClick, style, name }: ButtonProps) => {
    return (
       <button onClick={onClick} className={style}>
         {name}
       </button>
    );
   };
   
   export default Button;