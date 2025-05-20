import { useParams } from "react-router-dom";

export function RopaDetalle(props) {
    const {codigo} = useParams();

    return(
        <div>
            DETALLES DEL PRODUCTO {props.codigo}
        </div>
    )
}
export default RopaDetalle;