ARG BASE_CONTAINER=jupyter/scipy-notebook:python-3.9.12

FROM ${BASE_CONTAINER}

USER ${NB_UID}

WORKDIR "${HOME}"

RUN mamba install --quiet --yes \
    'jupyter-packaging=0.12.*' \
    'twine' \
    'conda-build' \
    && \
    mamba clean --all -f -y && \
    fix-permissions "${CONDA_DIR}" 

COPY --chown=${NB_UID}:${NB_GID} ./ divewidgets/

# RUN cd divewidgets/ && \
#     pip install --quiet --no-cache-dir -e . && \
#     jupyter labextension develop . --overwrite && \
#     fix-permissions "${CONDA_DIR}"

CMD ["start-notebook.sh", "--LabApp.collaborative=True"]