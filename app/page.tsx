import { FaBrain, FaRoad, FaCar } from "react-icons/fa"
import { HiArrowNarrowRight } from "react-icons/hi"

export default function Home(){
  return(
    <main className="home">
      <h1>Create Your Ai Car</h1>
      <p>In this app you can create a brain using <span>sensory, intermediate, action</span> neurons and creating connections between them.</p>
      <p>You can set <span>threshHolds</span> for intermediate and action neurons. Other than that you can set a <span>weight</span> for each connections.</p>
      <p>Setting threshHolds can be done both manually and randomly. Then you can check the bain of your car by testing it on the path you've just created.</p>
      <div className="icon-div">
        <span className="icons">
          <FaBrain/>
          <span>Create the Brain</span>
        </span>
        <span className="arrow"><HiArrowNarrowRight/></span>
        <span className="icons">
          <FaRoad/>
          <span>Create the Road</span>
        </span>
        <span className="arrow"><HiArrowNarrowRight/></span>
        <span className="icons">
          <FaCar/>
          <span>Test Your Car</span>
        </span>
      </div>

      <div className="note-box">
        <h2>
          Notes for using platform
        </h2>
        <ul>
          <strong>Making Brain</strong>
          <li>There are gonna be four statis action neurons. you can not move or remove them. if you want to disable one of them just avoid adding any connections to it and make it's threshhold the maximum(most red).</li>
          <li>You can move the neurons by clicking on them and dragging them around.</li>
          <li>You can add new neurons by choosing the type of the neuron from the options that are given to you and then left clicking in the position that you want it to be added.</li>
          <li>You can remove the neurons and their connections by hovering and right clicking on them.</li>
          <li>You can unselect a neuron by right clicking in a free space of the canvas.</li>
          <li>You can connect the neurons by selecting them one after the other. But you can not add connections between two sensory neurons and two actions neurons.</li>
          <li>For setting the thresh holds of the action and intermediate neurons, you need to hover on them, then use the mouse wheel to set the thresh hold.</li>
          <li>You can set the connection(segment) weights like setting the thresh holds.(blue means negative and yellow means positiove)</li>
        </ul>
        <ul>
          <strong>Making Path</strong>
          <li>You can create roads by adding points and connecting them using segments.</li>
          <li>You can unselect a point by right clicking in a free space of the canvas.</li>
          <li>You can also remove them by hovering and right cicking on them.</li>
          <li>You can also drag the points around.</li>
          <li>You set the zoom of the canvas by using mouse wheel and scrolling.</li>
          <li>You can also chnage the veiw point and dragging the canvas around by left clicking and pressing altkey togheter.</li>
          <li>You also need to add the starting and ending point to the path before saving it.</li>
          <li>You can also create straight lines by pressing shiftkey.</li>
          <li>You can also remove a segment between points by hovering and right clicking on it.</li>
          <li>Please try to add the starting rect and ending rect after you are done creating the road. if you change the road sometimes the position of the starting and ending rect are not inside the road correctly. So you're gonna need to add it again.</li>
        </ul>
      </div>
    </main>
  )
}