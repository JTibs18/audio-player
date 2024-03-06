interface FileInputProps {
    onFileSelected: (fileUrl: string) => void;
}

const FileInput = ({ onFileSelected }: FileInputProps) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            onFileSelected(fileUrl); 
        }
    };

    return <input type="file" onChange={handleFileChange} />;
};

export default FileInput; 