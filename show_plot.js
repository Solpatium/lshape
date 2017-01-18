$( document ).ready(function() {
  function showPlot( divide ) {
    var plot = lShape(divide);

    // Plotting the mesh
    var data=[
      {
        opacity:0.8,
        color:'rgb(300,100,200)',
        type: 'scatter3d',
        mode: 'markers',
        x: plot.x,
        y: plot.y,
        z: plot.z,
      }
    ];
    Plotly.newPlot('plot', data);
  }

  $('#show_plot').click( function() {
    showPlot( parseInt($('#divisions').val()) );
  });
  showPlot(1);
});
