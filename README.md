# js-changes-graph
Visualize changes tree (commits and branches graph) using SVG

**Simple usage:**

```javascript
<style>
svg circle.node {
	stroke: blue;
	fill: blue;
}
</style>

<ul id="changes-graph">
    <li x-id="1" x-parent="null">Initial commit</li>
    <li x-id="2" x-parent="1">Basic Changes</li>
    <li x-id="3" x-parent="1">Other changes</li>
    <li x-id="4" x-parent="1">Newer Changes</li>
    <li x-id="5" x-parent="3">Different Changes</li>
    <li x-id="6" x-parent="5">Change Change Change</li>
    <li x-id="7" x-parent="1">Different one, and <a href="http://www.google.com/">a link to Google</a></li>
</ul>

<script>
var changesGraph = new ChangesGraph(document.getElementById('changes-graph'));
</script>
```
