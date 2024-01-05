import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"

export default function ControlPresupuesto({ gastos, 
    presupuesto,
    setGastos,
    setPresupuesto,
    setIsValidPresupuesto
}) {
    const [porcentaje, setPorcentaje] = useState(0)
    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)

    useEffect(() => {
        const totalGastado = gastos.reduce( (total, gasto) => gasto.cantidad + total, 0)
        const totalDisponible = presupuesto - totalGastado

        //Calculo porcentaje
        const nuevoPorcentaje = (( (presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2);

        setDisponible(totalDisponible)
        setGastado(totalGastado)
        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje)            
        }, 650);
    }, [gastos])

    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        })
    }

    const handleResetApp = () => {
        Swal.fire({
            title: "¿Quieres eliminar este gasto?",
            showDenyButton: true,
            confirmButtonText: "Eliminar",
            denyButtonText: `Cancelar`,
            confirmButtonColor: "#3B82F6",
          }).then((result) => {
            if (result.isConfirmed) {
                setGastos([])
                setPresupuesto(0)
                setIsValidPresupuesto(false)
              Swal.fire("¡Eliminado con éxito!", "", "success");
            } else if (result.isDenied) {
              Swal.fire("¡No se ha eliminado el gasto!", "", "warning");
            }
          });
    }

    return(
        <div className="contenedor-presupuesto contenedor sombra dos-columnas">
            <CircularProgressbar 
            styles={buildStyles({
                pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                trailColor: '#F5F5F5',
                textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6'
            })}
            value={porcentaje}
            text={`${porcentaje} % Gastado`}
            />            
            <div className="contenido-presupuesto">
                <button className="reset-app" type="button" onClick={handleResetApp}>
                    Resetear App
                </button>
                <p>
                    <span>Presupuesto: </span>{formatearCantidad(presupuesto)}
                </p>

                <p className={`${disponible < 0 ? 'negativo' : '' }`}>
                    <span>Disponible: </span>{formatearCantidad(disponible)}
                </p>

                <p>
                    <span>Gastado: </span>{formatearCantidad(gastado)}
                </p>
            </div>
        </div>
    )
}