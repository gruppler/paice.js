paice.js
========
A JavaScript implementation of the Lancaster Stemmer by Craig Laparo (http://github.com/gruppler).

Loosely translated from Perl code found at:
http://www.comp.lancs.ac.uk/computing/research/stemming/Links/implementations.htm

Usage:
------
Just include the script. Then, call `getStem` on any string to return its stem.

Example:
```
...
<script src="paice.min.js"></script>
<script>
    "stemming".getStem();   // Returns "stem"
</script>
...
```
