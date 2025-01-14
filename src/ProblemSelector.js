import React, { useState } from "react";

const ProblemSelector = ({ problems, onProblemChange }) => {
	const [selectedProblem, setSelectedProblem] = useState("");

	const handleChange = (e) => {
	const problem = e.target.value;
	setSelectedProblem(problem);
	onProblemChange(problem); // Gọi hàm vẽ guideline
	};

	return (
	<div>
		<label htmlFor="problem-selector">Choose a problem:</label>
		<select
		id="problem-selector"
		value={selectedProblem}
		onChange={handleChange}
		>
		<option value="" disabled>
			Select a problem
		</option>
		{problems.map((problem, index) => (
			<option key={index} value={problem}>
			{problem}
			</option>
		))}
		</select>
	</div>
	);
	};

export default ProblemSelector;
