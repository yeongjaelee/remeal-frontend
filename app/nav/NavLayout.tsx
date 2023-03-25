import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";

export default function NavLayout({
                                         children,
                                     }: {
    children: React.ReactNode,
}) {
    return (
        <div>
            <div className="flex justify-between pl-4 pt-4 pb-4 pr-4">
                <div>
                    <a href="/" className="homepageButton">
                        {/*<img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt=""/>*/}
                        <img src={`http://localhost:3000/img/logo.png`} alt="" width="78" height="18"/>
                    </a>
                </div>
                <div className="justify-items-end">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" />
                </div>

            </div>
            {children}

        </div>
    );
}