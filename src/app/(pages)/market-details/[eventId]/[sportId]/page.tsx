
import dynamic from 'next/dynamic'

// Server Component:
const MarketDetailsComp = dynamic(() => import('./marketDetails'))

export default function MarketDetailsComponent() {
    return (
        <div>
            <MarketDetailsComp />
        </div>
    )

}
