# TSC Visualizer

A tool for
visualizing and exploring time series compound datasets.

The tool can be accessed 
[here](https://plessard20.github.io/TSCVisualizer/home.html), or by running the home.html file.

The interface should all be self-explanatory
with the exception of the feature for 
uploading your own data. The data must be
 csv file with the following format:
```
id,time,value,event,distance,k
string,int,float,(1 or 0),float,int
...
``` 
Each TSC should be stored in a separate csv file, and there should be a row
for each time index between the first and last data points in the TSC. For
times that don't have data (ie. gaps), the "value" field should be "NaN."

No libraries (besides d3, Bootstrap, and AOS)
were used in creating this visualization
tool. All of the coding was done by hand
using some examples as reference points.

This tool is a modification of the [Nothin' But A Good Time](https://github.com/pslessard/Nothin-But-A-Good-Time) project by Philippe Lessard and Petra Kumi.
