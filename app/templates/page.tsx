import React from 'react'
import Portfolio from './ThreeDDarkPortfolio';
import PrismOrbs from './GreenbowPortfolio';
import GamePortfolio from "./GamePortfolio";
import StudentJourneyGame from './StudentJourneyGame';
type Props = {}

const page = (props: Props) => {
  return (
    <div>
        {/* <Portfolio/> */}
        {/* <PrismOrbs/> */}
        {/* <GamePortfolio/> */}
        <StudentJourneyGame/>
    </div>
  )
}

export default page