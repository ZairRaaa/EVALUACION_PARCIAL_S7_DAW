import { useParams } from 'react-router-dom';
import { ModulePlaceholder } from '../../shared/components/ModulePlaceholder';

export function ReceiptPage() {
  const { loanId } = useParams();
  return <ModulePlaceholder title={`Comprobante: ${loanId}`} owner="Alvitrez" tasks={[
    'Leer el préstamo por su ID y manejar un préstamo inexistente.',
    'Mostrar usuario, libro, fechas y código único desde el registro persistido.',
    'Descargar un PDF con jsPDF.',
  ]} />;
}
