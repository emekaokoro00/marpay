
import os
import csv
import json
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

# node attributes
node_ids = []
name_dict = {}
gender_dict = {}
type_dict = {}

# edge atrributes
edge_cost_dict = {}
edge_efficiency_dict = {}

##### EdgeList for Network1 ###############################################################################################################
# # edgelist in csv format
# network_nodelist = os.path.join(current_folder, 'data/set_1/physician_patient_thw_nodelist.csv')
# # network_edgelist = os.path.join(current_folder, 'physician_patient_edgelist.csv')
# network_edgelist = os.path.join(current_folder, 'data/set_1/edge_list/physician_patient_thw_edgelist.csv')

# # Nodes
# with open(network_nodelist, 'r') as nodecsv: # Open the file
#     nodereader = csv.reader(nodecsv) # Read the csv
#     nodes = [n for n in nodereader][1:] # Retrieve the data (using Python list comprhension and list slicing to remove the header row)
# node_ids = [n[0] for n in nodes] # Get a list of only the node ids
# for n in nodes: # Loop through the list to get attributes from nodes. Create dictionary with key from node_ids
#     name_dict[n[0]] = n[1]
#     gender_dict[n[0]] = n[2]
#     type_dict[n[0]] = n[3]

# # Edges
# with open(network_edgelist, 'r') as edgecsv: # Open the file
#     edgereader = csv.reader(edgecsv) # Read the csv
#     edges = [tuple(e) for e in edgereader][1:] # Retrieve the data
# # edge_length = len(edges) # print(len(node_ids))


##### AdjacencyList for Network2 ##########################################################################################################
# adjacency list in json format
network_nodelist = os.path.join(current_folder, 'data/set_2/physician_patient_thw_nodelist.json')
network_edgelist = os.path.join(current_folder, 'data/set_2/adjacency_list/physician_patient_thw_adjacencylist.json')

# Nodes
with open(network_nodelist) as nodejson:
    nodejsonreader = json.loads(nodejson.read())
    nodes = [n for n in nodejsonreader] # Retrieve the data (using Python list comprhension and list slicing to remove the header row)
node_ids = [n.get('ID') for n in nodes] # Get a list of only the node ids
for n in nodes: # Loop through the list to get attributes from nodes. Create dictionary with key from node_ids
    name_dict[n.get('ID')] = n.get('Name')
    gender_dict[n.get('ID')] = n.get('Gender') 
    type_dict[n.get('ID')] = n.get('Type') 

# Edges
# default edge parameters. cost is weight. efficiency can be calculated.
e_alpha = 10 # α [cost-of-individual-use]
e_lambda = 300 # λ [cost-of-hospitalization]
e_beta = 24 # β [optimal-number-of-times-for-patient-node-attention] 
e_gamma = 12 # γ [average-number-of-times-for-patient-node-attention-across-all-platforms] 
e_gamma_h = 3 # γ [average-number-of... for telemedcine] 
e_gamma_t = 5 # γ [average-number-of... for THW] 
e_mu = 1 # μ [objectivity-and-adherence-factor]. 
e_mu_h = 1 # μ [objectivity-and... for telemedcine]. 
e_mu_t = 1 # μ [objectivity-and... for THW]. 

with open(network_edgelist, 'r') as edgejson: # Open the file
    edgejsonreader = json.loads(edgejson.read()) # Read the json
    edges = []
    for e in edgejsonreader:
        e_nodeID = e.get('NodeID')
        e_node_edgelist = e.get('Edges')
        for e_connected_edge in e_node_edgelist:
            e_alpha_edge = e_alpha
            e_lambda_edge = e_lambda
            e_beta_edge = e_beta
            e_gamma_edge = e_gamma
            e_gamma_edge_h = e_gamma_h
            e_gamma_edge_t = e_gamma_t
            e_mu_edge = e_mu
            e_mu_edge_h = e_mu_h
            e_mu_edge_t = e_mu_t
            if 'E_alpha' in e_connected_edge:
                e_alpha_edge = float(e_connected_edge.get('E_alpha'))
            if 'E_lambda' in e_connected_edge:
                e_lambda_edge = float(e_connected_edge.get('E_lambda'))
            if 'E_beta' in e_connected_edge:
                e_beta_edge = float(e_connected_edge.get('E_beta'))
            if 'E_gamma' in e_connected_edge:
                e_gamma_edge = float(e_connected_edge.get('E_gamma'))
            if 'E_gamma_h' in e_connected_edge:
                e_gamma_edge_h = float(e_connected_edge.get('E_gamma_h'))
            if 'E_gamma_t' in e_connected_edge:
                e_gamma_edge_t = float(e_connected_edge.get('E_gamma_t'))
            if 'E_mu' in e_connected_edge:
                e_mu_edge = float(e_connected_edge.get('E_mu'))
            if 'E_mu_h' in e_connected_edge:
                e_mu_edge_h = float(e_connected_edge.get('E_mu_h'))
            if 'E_mu_t' in e_connected_edge:
                e_mu_edge_t = float(e_connected_edge.get('E_mu_t'))
            
            # [ α(pn-dn) * γ(pn-dn) ] + λ(pn-dn) [1 – ( γ(pn-dn) / β(pn-dn) )] #  default values 120 + 150        
            edge_cost = (e_alpha_edge * e_gamma_edge) + e_lambda_edge * (1 - (e_gamma_edge/e_beta_edge))

            # μ(pn-dn) * γ(pn-dn) + [1 – ( γ(pn-dn) / β(pn-dn) )]
            edge_efficiency = np.multiply(e_alpha_edge,1) 

            single_edge = [e_nodeID, e_connected_edge.get('NodeID'), { 'cost': edge_cost, 'efficiency': edge_efficiency }]  
            edges.append(tuple(single_edge))
# edge_length = len(edges) # print(len(node_ids))

##### Graph Analysis and Visualization ####################################################################################################

G = nx.Graph() #initialize graph object # G = nx.DiGraph()
G.add_nodes_from(node_ids)
G.add_edges_from(edges)
# G.add_weighted_edges_from(edges)
print(nx.info(G))

density = nx.density(G)
print("Network density:", density)

# Set node attributes in graph
nx.set_node_attributes(G, name_dict, 'name')
nx.set_node_attributes(G, gender_dict, 'gender')
nx.set_node_attributes(G, type_dict, 'type')

# Set edge attributes in graph
# nx.set_edge_attributes(G, edge_cost_dict, 'cost')

# for n in G.nodes(): # Loop through every node, in our data "n" will be the name of the person
#     print(n, G.nodes[n]['type']) # Access every node by its name, and then by the attribute "birth_year"

nodetype_bgcolor_dict = { "patient": "rgb(40,40,40)", "thw": "rgb(150,250,150)", "physician": "rgb(240,240,240)" }
nodetype_txtcolor_dict = { "patient": "rgb(255,255,255)", "thw": "rgb(0,0,0)", "physician": "rgb(0,0,0)" }

# Get positions for the nodes in G
pos_ = nx.spring_layout(G)

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
        width = 0.008 * G.edges()[edge]['cost'] # or nx.get_edge_attributes(G,'cost')[edge] # get cost attribute of edge, constant to match display 
        trace  = make_edge([x0, x1, None], [y0, y1, None], text, width = round(width)) # width=1 sets thickness of all edge outlines
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