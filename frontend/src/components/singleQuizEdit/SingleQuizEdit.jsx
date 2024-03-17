import React from "react";
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { AiOutlineClose } from 'react-icons/ai';

import replaceCategoryName from "../../utils/replaceCategoryName";

// import { deleteQuiz, calculateTotalCost, setErrorMessage, setErrorValue } from "../../redux/contestSlip/contestslip.actions";


const SingleQuizEdit = (props) => {
    const { t } = useTranslation(["common"]);

    const { title, odds, category, id, deleteQuiz } = props;


    const handleDelete = () => {
            deleteQuiz(id)
            //console.log(bets);
    }

    //var toReturn;

    // if(stakeType == 'single' || stakeType == 'multi'){
    //     toReturn = odds * stake;
    // } else {
    //     toReturn = 0;
    // }

    return (
        <>

        <div className="quiz__container">
            <div className="quiz__container__body">
                <p>{replaceCategoryName(category)}</p>
                <AiOutlineClose fontSize={"1.5rem"} className="quiz__container__icon" onClick={handleDelete} />
            </div>
            <div className="quiz__container__body">
                <p>{title}</p>
                <h1 className="quiz__container__header__odd">
                    {odds == 'suspended' ? <span>{t("suspended")}</span> : odds}
                </h1>
            </div>
        </div>


        {/* <div className="betslip__header">
            <div className='betslip__header__quiz'>
                <AiOutlineClose fontSize={"1.5rem"} className="betslip__header__icon" onClick={handleDelete} />
                <h1 className="betslip__title">
                    {title}
                </h1>
                <h1 className="betslip__odd">
                    {odds == 'suspended' ? <span>SUS</span> : odds}
                </h1>
            </div>            
        </div>
        <div className="betslip__body">
            <p>{category}</p>
            <p>{teams}</p>
        </div> */}
    </> 
    )
}


// const mapDispatchToProps = dispatch => ({
//     deleteQuiz: id => dispatch(deleteQuiz(id)),
//     setErrorMessage: (value) => dispatch(setErrorMessage(value)),
//     setErrorValue: (value) => dispatch(setErrorValue(value)),
//     calculateTotalCost: () => dispatch(calculateTotalCost())
// })

export default SingleQuizEdit;