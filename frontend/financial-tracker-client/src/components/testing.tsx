 type ToolbarProps = {
  onPlayMovie: () => void;
  onUploadImage: () => void;
};
 
type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode
}
 export default function Toolbar({ onPlayMovie, onUploadImage}: ToolbarProps){
    return (
        <div>
            <Button onClick ={onPlayMovie}>
                Play Movie 
            </Button>
            <Button onClick={onUploadImage}>
                Upload Image 
            </Button>
        </div>
    );
 }

 function Button({onClick, children}: ButtonProps) {
    return (
        <div>
            <button onClick={onClick}>
                {children}
            </button>
        </div>
    );

 }