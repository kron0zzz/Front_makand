import { Plus} from "lucide-react";
import {useEffect, useState} from "react";
import { formatDate } from "../../../../../../shared/utils/dateUtils";

import "./CutsTab.css";
import CutForm from "./CutForm";
//import { useWorkspace } from "../../../../hooks/useWorkspace";

const CutsTab = ({cuts, order,onCreateCut}) => {


    const [showCutForm, setShowCutForm] = useState(false);

  
    const totalAmount =
        cuts.reduce(
            (acc, cut) =>
                acc + Number(cut.cut_amount),
            0
        );

       


    return (
        <div className="cuts-tab">
            <div className="cuts-header">
                <div>
                    <h2>
                        Cortes de facturación
                    </h2>

                </div>

                <button
                    className="btn-cut"
                    //onClick={onCreateCut}
                    onClick={() => setShowCutForm(true)}
                >

                    <Plus size={18}/>
                    Registrar corte
                </button>

            </div>



            <div className="cuts-summary">
                <div>
                    <span>
                        Total cortes
                    </span>

                    <strong>
                        {cuts.length}
                    </strong>
                </div>

                <div>

                    <span>
                        Valor facturado
                    </span>

                    <strong>
                        ${totalAmount.toLocaleString()}
                    </strong>

                </div>

            </div>



            {
                cuts.length === 0 && (
                    <div className="empty-cuts">
                        No existen cortes registrados.
                    </div>
                )
            }



            <div className="timeline">

                {

                    [...cuts]

                    .sort(

                        (a,b)=>

                            formatDate(b.period_end_date)-

                            formatDate(a.period_end_date)

                    )

                    .map(cut=>(

                        <div
                            className="timeline-item"
                            key={cut.cut_id}
                        >

                            <div className="timeline-marker">

                                <div className="timeline-head">

                                    <div className="timeline-dot"/>

                                    <span className="timeline-date">
                                        {formatDate(cut.period_end_date)}
                                    </span>

                                </div>

                            </div>

                            <div className="timeline-card">

                                <div className="timeline-range">

                                    <span>

                                        Desde

                                        <strong>

                                            {
                                                formatDate(
                                                    cut.period_start_date
                                                )
                                            }

                                        </strong>

                                    </span>

                                    <span className="arrow">

                                        ↓

                                    </span>

                                    <span>

                                        Hasta

                                        <strong>

                                            {
                                                formatDate(
                                                    cut.period_end_date
                                                )
                                            }

                                        </strong>

                                    </span>

                                </div>

                                <div className="timeline-info">

                                    <div>

                                        <small>Corte</small>

                                        <strong>

                                            #{cut.cut_id}

                                        </strong>

                                    </div>

                                    <div>

                                        <small>Registrado</small>

                                        <strong>

                                            {

                                                formatDate(
                                                    cut.cut_date
                                                )

                                            }

                                        </strong>

                                    </div>

                                    <div>

                                        <small>Valor</small>

                                        <strong className="amount">

                                            $

                                            {

                                                Number(
                                                    cut.cut_amount
                                                ).toLocaleString()

                                            }

                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

            <CutForm
                isOpen={showCutForm}
                onClose={() => setShowCutForm(false)}
                order={order}
                onSubmit={onCreateCut}
            />

        </div>

        

    );

};

export default CutsTab;