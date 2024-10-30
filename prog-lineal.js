// Función para agregar una nueva restricción
function addRestriction() {
    const restrictionDiv = document.createElement("div");
    restrictionDiv.className = "restriction";
    restrictionDiv.innerHTML = `
        <label>A:</label><input type="number" class="a" value="">
        <label>B:</label><input type="number" class="b" value="">
        <label>C:</label><input type="number" class="c" value="">
        <button onclick="removeRestriction(this)">Eliminar</button>
    `;
    document.getElementById("restrictions").appendChild(restrictionDiv);
}

// Función para eliminar una restricción específica
function removeRestriction(button) {
    const restrictionDiv = button.parentNode;
    document.getElementById("restrictions").removeChild(restrictionDiv);
}

// Función para borrar todas las restricciones
function clearRestrictions() {
    document.getElementById("restrictions").innerHTML = "";
    addRestriction(); // Añadir una restricción por defecto después de limpiar
}

// Función para calcular la intersección de dos restricciones
function calculateIntersection(line1, line2) {
    const [A1, B1, C1] = line1;
    const [A2, B2, C2] = line2;
    const determinant = A1 * B2 - A2 * B1;

    if (determinant === 0) return null; // Las líneas son paralelas

    const x = (C1 * B2 - C2 * B1) / determinant;
    const y = (A1 * C2 - A2 * C1) / determinant;
    return { x, y };
}

// Función para calcular y graficar la región factible
function calculate() {
    // Obtener la función objetivo
    const z1 = parseFloat(document.getElementById("z1").value);
    const z2 = parseFloat(document.getElementById("z2").value);

    // Obtener restricciones
    const restrictions = Array.from(document.querySelectorAll(".restriction")).map(div => {
        const a = parseFloat(div.querySelector(".a").value);
        const b = parseFloat(div.querySelector(".b").value);
        const c = parseFloat(div.querySelector(".c").value);
        return [a, b, c];
    });

    // Encontrar intersecciones y verificar región factible
    const points = [];
    for (let i = 0; i < restrictions.length; i++) {
        for (let j = i + 1; j < restrictions.length; j++) {
            const intersection = calculateIntersection(restrictions[i], restrictions[j]);
            if (intersection && isFeasible(intersection, restrictions)) {
                points.push(intersection);
            }
        }
    }

    // Evaluar la función objetivo en cada punto
    let optimalValue = -Infinity;
    let optimalPoint = null;
    points.forEach(point => {
        const value = z1 * point.x + z2 * point.y;
        if (value > optimalValue) {
            optimalValue = value;
            optimalPoint = point;
        }
    });

    // Mostrar resultados
    document.getElementById("optimal-solution").innerHTML = `Punto óptimo: (${optimalPoint.x.toFixed(2)}, ${optimalPoint.y.toFixed(2)}) con valor de Z = ${optimalValue.toFixed(2)}`;

    // Graficar restricciones y región factible
    plotGraph(restrictions, points, optimalPoint);
}

// Verificar si un punto es factible
function isFeasible(point, restrictions) {
    return restrictions.every(([a, b, c]) => a * point.x + b * point.y <= c);
}

// Graficar usando Plotly.js
function plotGraph(restrictions, feasiblePoints, optimalPoint) {
    const data = restrictions.map(([a, b, c]) => {
        const x = [0, c / a];
        const y = [c / b, 0];
        return {
            x, y,
            mode: "lines",
            type: "scatter",
            name: `${a}x + ${b}y <= ${c}`
        };
    });

    // Puntos de la región factible
    data.push({
        x: feasiblePoints.map(p => p.x),
        y: feasiblePoints.map(p => p.y),
        mode: "markers",
        type: "scatter",
        name: "Puntos Factibles",
        marker: { color: "blue" }
    });

    // Punto óptimo
    data.push({
        x: [optimalPoint.x],
        y: [optimalPoint.y],
        mode: "markers+text",
        type: "scatter",
        name: "Óptimo",
        marker: { color: "red", size: 10 },
        text: [`(${optimalPoint.x.toFixed(2)}, ${optimalPoint.y.toFixed(2)})`],
        textposition: "top right"
    });

    // Configuración del gráfico
    const layout = {
        title: "Gráfico de la Región Factible",
        xaxis: { title: "x" },
        yaxis: { title: "y" }
    };

    Plotly.newPlot("graph", data, layout);
}

//Reiniciar todo
function reset(){
    location.reload()
}