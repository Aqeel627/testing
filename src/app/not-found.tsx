import dynamic from 'next/dynamic';
const NotFoundComponent = dynamic(() => import("@/components/common/not-found-component"));


const NotFound = () => {
  return (
    <NotFoundComponent />
  )
}

export default NotFound