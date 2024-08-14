

class Group:
    """
    An :class:`mlx.core.distributed.Group` represents a group of independent mlx
    processes that can communicate.
    """

    def rank(self) -> int:
        """Get the rank of this process"""

    def size(self) -> int:
        """Get the size of the group"""

    def split(self, color: int, key: int = -1) -> Group:
        """
        Split the group to subgroups based on the provided color.

        Processes that use the same color go to the same group. The ``key``
        argument defines the rank in the new group. The smaller the key the
        smaller the rank. If the key is negative then the rank in the
        current group is used.

        Args:
          color (int): A value to group processes into subgroups.
          key (int, optional): A key to optionally change the rank ordering
            of the processes.
        """

def all_gather(x: array, *, group: Optional[Group] = None) -> array:
    """
    Gather arrays from all processes.

    Gather the ``x`` arrays from all processes in the group and concatenate
    them along the first axis. The arrays should all have the same shape.

    Args:
      x (array): Input array.
      group (Group): The group of processes that will participate in the
        gather. If set to ``None`` the global group is used. Default:
        ``None``.

    Returns:
      array: The concatenation of all ``x`` arrays.
    """

def all_sum(x: array, *, group: Optional[Group] = None) -> array:
    """
    All reduce sum.

    Sum the ``x`` arrays from all processes in the group.

    Args:
      x (array): Input array.
      group (Group): The group of processes that will participate in the
        reduction. If set to ``None`` the global group is used. Default:
        ``None``.

    Returns:
      array: The sum of all ``x`` arrays.
    """

def init(strict: bool = False) -> Group:
    """
    Initialize the communication backend and create the global communication group.

    Args:
      strict (bool, optional): If set to False it returns a singleton group
        in case ``mx.distributed.is_available()`` returns False otherwise
        it throws a runtime error. Default: ``False``

    Returns:
      Group: The group representing all the launched processes.
    """

def is_available() -> bool:
    """Check if a communication backend is available."""
