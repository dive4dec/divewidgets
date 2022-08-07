from IPython.core.magic import (Magics, magics_class, line_magic,
                                cell_magic)
from IPython.core.magic_arguments import (argument, magic_arguments,
                                          parse_argstring)

from .widget import create_JSXGraph, create_mermaid, create_flowchart, create_optlite

# from IPython.display import IFrame, display
# from urllib.parse import quote

@magics_class
class DIVEMagics(Magics):
    """IPython magics to create interative widgets.
    """
    @magic_arguments()
    @argument(
        '-w', '--width', type=int, default=600,
        help="The width of the output frame (default: 600)."
    )
    @argument(
        '-i', '--id', type=str, default='box',
        help="id of a <div> element for embeding the board."
    )
    @argument(
        '-h', '--height', type=int, default=600,
        help="The height of the output frame (default: 600)."
    )
    @argument(
        '-m', '--mathjax_url', type=str, default='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
        help="Absolute/relative url of the javascript file in loading mathjax."
    )
    @cell_magic
    def jsxgraph(self, line, cell):
        """Run the cell block of JSXGraph Code.
        """
        opts = parse_argstring(self.jsxgraph, line)
        return create_JSXGraph(code=cell.strip(), height=opts.height, width=opts.width, id=opts.id, mathjax_url=opts.mathjax_url)

    @cell_magic
    def mermaid(self, line, cell):
        """Run the cell block of MermaidJS code.
        """
        return create_mermaid(code=cell.strip())

    @cell_magic
    def flowchart(self, line, cell):
        """Run the cell block of FlowchartJS code.
        """
        return create_flowchart(code=cell.strip())

@magics_class
class OPTMagics(Magics):
    """IPython magics to create interactive OPT visualizations of program execution.
    """
    @magic_arguments()
    @argument(
        '-w', '--width', type=int, default=1100,
        help="The width of the output frame (default: 1100)."
    )
    @argument(
        '-r', '--run', action='store_true',
        help="Run cell in IPython."
    )
    @argument(
        '-l', '--live', action='store_true',
        help="Live edit mode."
    )
    @argument(
        '-h', '--height', type=int, default=700,
        help="The height of the output frame (default: 700)."
    )
    @cell_magic
    def optlite(self, line, cell):
        """Visualize the cell block of Python code with the serverless OPTLite.
        """
        opts = parse_argstring(self.optlite, line)
        if opts.run:
            result = self.shell.run_cell(cell)
        return create_optlite(script=cell, live=opts.live, width=opts.width, height=opts.height)