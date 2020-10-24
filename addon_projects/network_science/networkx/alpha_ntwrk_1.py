
import os
import csv
from operator import itemgetter
import numpy as np

# Import packages for network analysis
import networkx as nx
from networkx.algorithms import community #This part of networkx, for community detection, needs to be imported separately.

# Import packages for network visualization
import plotly.offline as py
import plotly.graph_objects as go

# load current path
current_folder = os.path.dirname(os.path.abspath(__file__))
network_nodelist = os.path.join(current_folder, 'physician_patient_thw_nodelist.csv')
# network_edgelist = os.path.join(current_folder, 'physician_patient_edgelist.csv')
network_edgelist = os.path.join(current_folder, 'physician_patient_thw_edgelist.csv')

# Nodes
with open(network_nodelist, 'r') as nodecsv: # Open the file
    nodereader = csv.reader(nodecsv) # Read the csv
    # Retrieve the data (using Python list comprhension and list slicing to remove the header row, see footnote 3)
    nodes = [n for n in nodereader][1:]

# node_names = [n[0] for n in nodes] # Get a list of only the node names
node_ids = [n[0] for n in nodes] # Get a list of only the node names

# Get attributes from node
name_dict = {}
gender_dict = {}
type_dict = {}
for node in nodes: # Loop through the list, one row at a time. Create  dictionary with key from node_names
    name_dict[node[0]] = node[1]
    gender_dict[node[0]] = node[2]
    type_dict[node[0]] = node[3]


# Edges
with open(network_edgelist, 'r') as edgecsv: # Open the file
    edgereader = csv.reader(edgecsv) # Read the csv
    edges = [tuple(e) for e in edgereader][1:] # Retrieve the data

edge_length = len(edges)
# print(len(node_ids))
# print(len(edges)) 

G = nx.Graph() #initialize graph object
G.add_nodes_from(node_ids)
G.add_edges_from(edges)
print(nx.info(G))

density = nx.density(G)
print("Network density:", density)

# Set node attributes in graph
nx.set_node_attributes(G, name_dict, 'name')
nx.set_node_attributes(G, gender_dict, 'gender')
nx.set_node_attributes(G, type_dict, 'type')

# for n in G.nodes(): # Loop through every node, in our data "n" will be the name of the person
#     print(n, G.nodes[n]['type']) # Access every node by its name, and then by the attribute "birth_year"

# nodetype_color_dict = { "patient": "red", "thw": "green", "physician": "blue" }
nodetype_bgcolor_dict = { "patient": "rgb(40,40,40)", "thw": "rgb(150,250,150)", "physician": "rgb(240,240,240)" }
nodetype_txtcolor_dict = { "patient": "rgb(255,255,255)", "thw": "rgb(0,0,0)", "physician": "rgb(0,0,0)" }

# Get positions for the nodes in G
pos_ = nx.spring_layout(G)

# G.edges()[edge]['weight'] is the weight attribute which you can use to add info to edges (and nodes too)

# Custom function to create an edge between node x and node y, with a given text and width
def make_edge(x, y, text, width):
    return  go.Scatter(x         = x,
                       y         = y,
                       line      = dict(width = width, color = 'cornflowerblue'),
                       hoverinfo = 'text',
                       text      = ([text]),
                       mode      = 'lines',
                       showlegend = False
                       )

# For each edge, make an edge_trace, append to list
edge_trace = []
for edge in G.edges():    
        char_1 = edge[0]
        char_2 = edge[1]
        x0, y0 = pos_[char_1]
        x1, y1 = pos_[char_2]
        text   = char_1 + '--' + char_2 + ': '       
        trace  = make_edge([x0, x1, None], [y0, y1, None], text, width = 2) # width=1 sets thickness of all edge outlines
        edge_trace.append(trace)

# Make a node trace
node_trace = go.Scatter(x         = [],
                        y         = [],
                        text      = [],
                        # textposition = "top center",
                        textposition = "middle center",
                        # textfont_size = 20,
                        textfont=dict(
                            size=20,
                            color=[]
                        ),
                        mode      = 'markers+text',
                        hoverinfo = 'none',
                        showlegend= True,
                        marker    = dict(showscale=True,
                                        colorscale='YlGnBu',
                                        reversescale=True,
                                        color=[],
                                        size=60, #set size of node
                                        line=dict(width=40, color='black'), # set thickness of node outline
                                        line_width=2
                                        )
                        )
# For each node in G, get the position and size and add to the node_trace
for node in G.nodes():
    x, y = pos_[node]
    node_trace['x'] += tuple([x])
    node_trace['y'] += tuple([y]) 
    node_trace['text'] += tuple(['<b>' + node + '</b>'])
    node_trace['marker']['color'] += tuple([nodetype_bgcolor_dict[G.nodes()[node]['type']]]) # set color of node based on type from nodetype_color_dict # e.g. tuple(['red'])
    node_trace['textfont']['color'] += tuple([nodetype_txtcolor_dict[G.nodes()[node]['type']]]) # set color of node based on type from nodetype_color_dict # e.g. tuple(['red'])
    # node_trace['marker']['size'] += tuple([50 for i in range(len(node_names))]) # set size of node based on node/edge property
    


# Customize layout
layout = go.Layout(
    paper_bgcolor='rgba(0,0,0,0)', # transparent background
    plot_bgcolor='rgba(0,0,0,0)', # transparent 2nd background
    xaxis =  {'showgrid': False, 'zeroline': False}, # no gridlines
    yaxis = {'showgrid': False, 'zeroline': False}, # no gridlines
)
# Create figure
fig = go.Figure(layout = layout)

# Add all edge traces
for trace in edge_trace:
    fig.add_trace(trace)

# Add node trace
fig.add_trace(node_trace)


# # Remove legend
# fig.update_layout(showlegend = False)

# Remove tick labels
fig.update_xaxes(showticklabels = False)
fig.update_yaxes(showticklabels = False)

# Show figure
# fig.show(renderer="svg")
fig.show()