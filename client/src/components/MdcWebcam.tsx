import { BarcodeScanner, DetectedBarcode } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

export function MdcWebcam()
{
    function onCapture(barcode: DetectedBarcode)
    {
        window.alert(barcode.rawValue);
    }

    return (
        <BarcodeScanner
            options={{ delay: 500, formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }}
            onCapture={onCapture}
        />
    )
}