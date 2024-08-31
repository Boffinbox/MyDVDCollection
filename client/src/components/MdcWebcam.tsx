import { BarcodeScanner, DetectedBarcode } from 'react-barcode-scanner'
import 'react-barcode-scanner/polyfill'

export function MdcWebcam()
{
    return (
        <BarcodeScanner
            options={{ delay: 2000, formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }}
            onCapture={(barcode: DetectedBarcode) =>
                console.log(`barcode get! the barcode is: ${barcode}`)
            }
        />
    )
}