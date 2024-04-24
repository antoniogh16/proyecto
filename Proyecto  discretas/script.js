function generateCombinations(n) {
  const combinations = [];
  const maxNumber = 1 << n; // Equivalente a Math.pow(2, n)
  for (let i = 0; i < maxNumber; i++) {
    const binaryString = i.toString(2).padStart(n, '0');
    combinations.push(binaryString);
  }
  return combinations;
}

function circularPermute(bitString) {
  const permutations = [];
  let temp = bitString.split(''); // Convertir el string en un array para trabajar con él
  for (let i = 0; i < bitString.length; i++) {
    permutations.push([...temp]); // Hacer una copia del array para almacenar la permutación
    temp.push(temp.shift()); // Rotar el array
  }
  return permutations; // Esto devuelve un array de arrays de caracteres
}

function drawBits(bits, circleSVG) {
  const angleStep = 360 / bits.length;
  const numbersGroup = document.getElementById('numbersGroup');
  numbersGroup.innerHTML = ''; // Limpiar números anteriores

  bits.forEach((bit, index) => {
    const angle = (angleStep * index) - 90; // Ajustar para que 0 grados esté arriba
    const position = angleToPosition(angle, 80); // Radio del círculo

    // Crear el elemento de texto para cada bit
    const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.setAttribute("x", (position.x - 5).toString()); // Ajustar la posición para centrar el número
    textElement.setAttribute("y", (position.y + 5).toString()); // Ajustar la posición para centrar el número
    textElement.setAttribute("class", "bit");
    textElement.textContent = bit;
    numbersGroup.appendChild(textElement);
  });
}

function angleToPosition(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad)
  };
}

function updateOutput(permutation, output, totalPermutations, executionTime) {
  const p = document.createElement('p');
  p.textContent = `Permutación: ${permutation}`;
  output.appendChild(p);

  const totalPermutationsElement = document.getElementById('totalPermutations');
  totalPermutationsElement.textContent = totalPermutations;

  const executionTimeElement = document.getElementById('executionTime');
  executionTimeElement.textContent = `${executionTime.toFixed(2)} seconds`;
}

document.addEventListener('DOMContentLoaded', () => {
  const calculateButton = document.getElementById('calculateButton');
  const circleSVG = document.getElementById('circleSVG');
  const output = document.getElementById('output');

  calculateButton.addEventListener('click', () => {
    const nValue = document.getElementById('nValue');
    const n = parseInt(nValue.value, 10);

    output.innerHTML = ''; // Limpiar la salida anterior
    clearInterval(window.permutationInterval);

    if (isNaN(n) || n < 3) {
      output.innerHTML = '<p class="text-danger">Por favor, introduce un número válido (n ≥ 3).</p>';
      return;
    }

    const startTime = performance.now();
    const combinations = generateCombinations(n);
    let allPermutations = combinations.flatMap(circularPermute);
    allPermutations = [...new Set(allPermutations.map(permutationArray => permutationArray.join('')))]; // Filtrar permutaciones duplicadas

    const totalPermutations = allPermutations.length;

    let permutationIndex = 0;
    drawBits(allPermutations[permutationIndex].split(''), circleSVG);
    updateOutput(allPermutations[permutationIndex], output, totalPermutations, 0);

    window.permutationInterval = setInterval(() => {
      permutationIndex = (permutationIndex + 1) % totalPermutations;
      const currentPermutation = allPermutations[permutationIndex];
      drawBits(currentPermutation.split(''), circleSVG);
      updateOutput(currentPermutation, output, totalPermutations, (performance.now() - startTime) / 1000);

      // Si hemos mostrado todas las permutaciones, detener el intervalo
      if (permutationIndex === 0) {
        clearInterval(window.permutationInterval);
      }
    }, 1000);
  });
});
