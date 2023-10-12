"""Generate HTML for list of leg numbers in multiples of 4
    Doug Brantner 7/31/2023
"""

minN = 4
step = 4
maxN = 129 # NOTE: set to N+1 since python "range" excludes the last value

for n in range(minN, maxN, step):
    print('<option value="%d">%d</option>' % (n, n))
