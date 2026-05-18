import Link from "next/link"
import { FaBrain, FaRoad, FaCar } from "react-icons/fa"

export default function Pannel(){
    return(
        <main className="login-container row">
            <div className="card-cover col-lg-4 col-md-6 col-12">
                <div className="pannel-card-options create-brain">
                    <span><FaBrain/></span>
                    <Link href={'/pannel/brain/create'}><button>create a brain</button></Link>
                </div>
            </div>
            <div className="card-cover col-lg-4 col-md-6 col-12">
                <div className="pannel-card-options create-path">
                    <span><FaRoad/></span>
                    <Link href={'/pannel/path/create'}><button>create a path</button></Link>
                </div>
            </div>
            <div className="card-cover col-lg-4 col-md-6 col-12">
                <div className="pannel-card-options create-path">
                    <span><FaCar/></span>
                    <Link href={'/pannel/drive'}><button>Drive</button></Link>
                </div>
            </div>
        </main>
    )
}