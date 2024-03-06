import Image from 'next/image';

interface ButtonProps {
    onClick: () => void;
    name: string; 
    style?: string; 
    image?: string;
};

const Button = ({ onClick, name, style, image}: ButtonProps) => {
    return (
       <button className={style} onClick={onClick}>
            {
                image && <Image 
                            src={image}
                            width={30}
                            height={30}
                            alt={name}
                        />
            }
            {name}
       </button>
    );
};
   
export default Button;